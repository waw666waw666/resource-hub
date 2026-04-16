export interface User {
  id: string
  email?: string
  username: string
  avatar?: string
  createdAt?: string
}

export interface Resource {
  id: string
  title: string
  description?: string
  content: string
  coverImage?: string
  tags: string[]
  author: User
  likesCount: number
  commentsCount: number
  userLiked?: boolean
  createdAt: string
  updatedAt?: string
}

export interface Comment {
  id: string
  content: string
  author: User
  resourceId: string
  parentId?: string
  replies?: Comment[]
  createdAt: string
}

export interface PaginatedResources {
  resources: Resource[]
  total: number
  page: number
  totalPages: number
}
