# Claude Commerce

A simple demo e-commerce application created from instructions on Claude using Next.js and Supabase. It uses Supabase vector to bring up related item when viewing a certain item.

Checkout the video walk through of creating this application using Claude: https://youtu.be/g5NjMqj22qI

This project uses:

- Claude to generate dummy data
- Next.js as the frontend
- Supabase database for storing item data and their embeddings
- Supabase storage to store item images
- OpenAI to generate images and embeddings

## Getting Started

Generate dummy data

- Update the `script/fashion_data.json` file to update/ add dummy data
- Create a `script/.env` file and add OpenAI API key, Supabase URL, and Supabase service role key
- Run `npm start` inside the `script` directory to generate the images, embeddings, and store them in a Supabase project.

Run the application:

- Create a `app/.env.local` file and add your Supabase url and anon key
- Run `npm run dev` inside the `app` directory to run the app locally.

## Resources

- [Video walk through of the app](https://youtu.be/g5NjMqj22qI)
- [Supabase AI & Vectors guide](https://supabase.com/docs/guides/ai)
- [Supabase semantic search guide](https://supabase.com/docs/guides/ai/semantic-search)
- [The missing pieces to your AI app (pgvector + RAG in prod) vidoe](https://youtu.be/ibzlEQmgPPY?si=txt-luYBNJUCufkl)
