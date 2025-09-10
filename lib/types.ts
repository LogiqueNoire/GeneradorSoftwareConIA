export interface Article {
  id: number
  title: string
  subtitle?: string
  content: string
  tag?: string
  publish_date: string
  read_time: number
  created_at: string
  updated_at: string
}

export interface CreateArticleRequest {
  title: string
  subtitle?: string
  content: string
  tag?: string
  read_time?: number
}
