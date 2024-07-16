import fs from 'fs'
import path from 'path'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import axios from 'axios'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Define types
interface FashionItem {
  id: number
  name: string
  category: string
  description: string
  price: number
}

interface ProcessedFashionItem extends FashionItem {
  image_url: string
  embedding: number[]
}

// Initialize Supabase client
const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function generateImage(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    prompt: prompt,
    model: 'dall-e-2',
    n: 1,
    size: '1024x1024',
  })
  return response.data[0].url!
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  })
  return response.data[0].embedding
}

async function downloadImage(url: string, filepath: string): Promise<string> {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer',
  })

  fs.writeFileSync(filepath, response.data)
  return filepath
}

async function processItem(item: FashionItem): Promise<void> {
  console.log(`Processing item: ${item.name}`)

  // Generate embedding
  const embedding = await generateEmbedding(item.description)

  // Generate image
  const imagePrompt = `White background image for a e-commerce website with the following name and description: ${item.name} - ${item.description}`
  const imageUrl = await generateImage(imagePrompt)

  // Download image
  const imagePath = path.join(__dirname, 'images', `${item.id}.png`)
  await downloadImage(imageUrl, imagePath)

  const fileBuffer = fs.readFileSync(imagePath)

  // Upload image to Supabase Storage
  const { data, error } = await supabase.storage
    .from('fashion-images')
    .upload(`${item.id}.png`, fileBuffer, {
      upsert: true,
      contentType: 'image/png',
    })

  if (error) {
    console.error('Error uploading image:', error)
    return
  }

  const { data: supabaseImageUrl } = supabase.storage
    .from('fashion_images')
    .getPublicUrl(data.path)

  // Save data to Supabase database
  const processedItem: ProcessedFashionItem = {
    ...item,
    image_url: supabaseImageUrl.publicUrl,
    embedding,
  }

  const { data: insertData, error: insertError } = await supabase
    .from('fashion_items')
    .upsert(processedItem)

  if (insertError) {
    console.error('Error inserting data:', insertError)
  } else {
    console.log(`Processed item ${item.id} successfully`)
  }
}

async function main(): Promise<void> {
  // Read JSON file
  const jsonData: FashionItem[] = JSON.parse(
    fs.readFileSync('fashion_data.json', 'utf8')
  )

  // Process each item
  for (const item of jsonData) {
    await processItem(item)
    // break
  }

  console.log('Processing complete')
}

main().catch(console.error)
