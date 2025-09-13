import { Hono } from 'hono'
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import { Layout } from './components/Layout.tsx'
import { HomePage } from './components/HomePage.tsx'

type Bindings = {
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Bindings }>()


// Main route
app.get('/', (c) => {
  return c.html(
    <Layout>
      <HomePage />
    </Layout>
  )
})

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok',
    environment: c.env.ENVIRONMENT || 'development',
    timestamp: new Date().toISOString()
  })
})

export default app
