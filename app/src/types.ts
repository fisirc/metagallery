// Represents a row in the 'file' table
export interface UserContentFileElement {
  id: number,
  url: string,
  title?: string,
  description?: string,
  type: 'model3d' | 'image',
}
