import { useState } from "react"
import { Avatar, Divider, Flex, Text } from '@chakra-ui/react'
import Actions from "./Actions"

const Comment = ({ reply, isLastReply }) => {
  return (
    <>
      <Flex gap={4} py={2} my={2} w="full">
        <Avatar src={reply.profilePicture} size="sm" />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize="sm" fontWeight="bold">{reply.username}</Text>
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {!isLastReply ? <Divider /> : null}
    </>
  )
}

export default Comment