export interface IPhoto {
  id?: string,
  name: string,
  src: string,
  caption?: string,
  created_at?: string,
  updated_at?: string,
  is_published?: boolean,
  is_anonymous?: boolean
}