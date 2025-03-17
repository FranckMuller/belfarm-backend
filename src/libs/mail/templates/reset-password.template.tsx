import * as React from "react"
import { Heading, Body, Text, Link } from "@react-email/components"
import { Html } from "@react-email/html"

type Props = {
	domain: string
	token: string
}

export function ResetPasswordTemplate({ domain, token }: Props) {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  return (
    <Html>
      <Body>
        <Heading>Сброс пароля</Heading>
        <Text>
          Привет! Вы запросили сброс пароля. Пожалуйста, перейдите по следующей ссылке,
          чтобы создать новый пароль:
        </Text>
        <Link href={resetLink}>Подтвердить сброс пароля</Link>
        <Text>
          Эта ссылка действительна в течении 1 часа. Если вы не запрашивали 
          сброс пароля, просто проигнорируйте это сообщение.
        </Text>
        <Text>Спасибо за использование нашего сервиса!</Text>
      </Body>
    </Html>
  )
}
