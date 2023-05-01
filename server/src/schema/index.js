import { gql } from "apollo-server-express";
import messagesSchema from "./message.js";
import userSchema from "./user.js";

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`
export default [ linkSchema, messagesSchema, userSchema ]