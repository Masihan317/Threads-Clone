import { Avatar, Box, Flex } from '@chakra-ui/react'
import { Link } from "react-router-dom"

const UserPost = () => {
  return (
    <Link to="/markz/post/1">
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size="md" name="Mark Z" src="/zuck-avatar.png" />
          <Box w="1px" h="full" bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            <Avatar
              size="xs"
              name="John Doe"
              src="https://bit.ly/dan-abramov"
              position={"absolute"}
              top={"0px"}
              left={"15px"}
              p={"2px"}
            />
            <Avatar
              size="xs"
              name="John Doe"
              src="https://bit.ly/code-beast"
              position={"absolute"}
              bottom={"0px"}
              right={"-5px"}
              p={"2px"}
            />
            <Avatar
              size="xs"
              name="John Doe"
              src="https://bit.ly/sage-adebayo"
              position={"absolute"}
              bottom={"0px"}
              left={"4px"}
              p={"2px"}
            />
          </Box>
        </Flex>
        <Flex>
          
        </Flex>
      </Flex>
    </Link>
  )
}

export default UserPost