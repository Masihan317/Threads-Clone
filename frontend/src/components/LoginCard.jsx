import { Flex, Box, FormControl, FormLabel, Input, InputGroup, HStack, InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link } from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import useShowToast from '../hooks/useShowToast'
import userAtom from '../atoms/userAtom'

const LoginCard = () => {
  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreenState = useSetRecoilState(authScreenAtom)
  const setUser = useSetRecoilState(userAtom)
  const showToast = useShowToast()

  const [input, setInput] = useState({
    username: "",
    password: ""
  })

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/users/login", {
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
    }
  }

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={'4xl'} textAlign={"center"}>
            Login
          </Heading>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue('white', 'gray.dark')} boxShadow={"lg"} p={8} w={{ base: "full", sm: "400px" }}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" value={input.username} onChange={(e) => setInput({...input, username: e.target.value})} />
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
              <Button
                loadingText={"Submitting"}
                size={"lg"}
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{ bg: useColorModeValue("gray.700", "gray.800") }}
                onClick={handleLogin}
              >
                Log in
              </Button>
            </Stack>
            <Stack pt={"6"}>
              <Text align={"center"}>
                Not a user?{" "}
                <Link color={"blue.400"} onClick={() => setAuthScreenState("signup")}>Sign{" "}up</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default LoginCard