import { type SchemaTypeDefinition } from 'sanity'
import { userType } from './userType'
import { subredditType } from './subredditType'
import { postType } from './postType'
import { commentType } from './commentType'
import { voteType } from './voteType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [userType, subredditType, postType, commentType, voteType],
}
