import { Flex, Box, FormControl, FormLabel, Input, InputGroup, HStack, InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import useShowToast from '../hooks/useShowToast'
import userAtom from '../atoms/userAtom'

const SignUpCard = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const setAuthScreenState = useSetRecoilState(authScreenAtom)
  const setUser = useSetRecoilState(userAtom)
  const showToast = useShowToast()

  const [input, setInput] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  })

  const handleSignup = async () => {
    setIsLoading(true)

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input)
      })

      const data = await res.json()

      if (data.error) {
        showToast("Error", data.error, "error")
        return
      }

      localStorage.setItem("user-threads", JSON.stringify(data))
      setUser(data)
    } catch (err) {
      showToast("Error", err, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={'4xl'} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue('white', 'gray.dark')} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input type={"text"} value={input.name} onChange={(e) => setInput({...input, name: e.target.value})} />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type={"text"} value={input.username} onChange={(e) => setInput({...input, username: e.target.value})} />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input type="email" value={input.email} onChange={(e) => setInput({...input, email: e.target.value})} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? "text" : "password"} value={input.password} onChange={(e) => setInput({...input, password: e.target.value})} />
                <InputRightElement h={"full"}>
                  <Button variant={"ghost"} onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button loadingText={"Signing up"}
                size={"lg"}
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{ bg: useColorModeValue("gray.700", "gray.800") }}
                onClick={handleSignup}
                isLoading={isLoading}
              >
                Sign Up
              </Button>
            </Stack>
            <Stack pt={"6"}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link color={"blue.400"} onClick={() => setAuthScreenState("login")}>Log{" "}in</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default SignUpCard