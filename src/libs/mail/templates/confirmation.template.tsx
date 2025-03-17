import * as React from "react"
import { Heading, Body, Text, Link } from "@react-email/components"
import { Html } from "@react-email/html"

type Props = {
	domain: string
	token: string
}

export function ConfirmationTemplate({ domain, token }: Props) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`

  return (
    <Html>
      <Body>
        <Heading>Подтверждение почты</Heading>
        <Text>
          Привет! Чтобы подтвердить свой адрес электронной почты, пожалуйста, перейдите по следующей ссылке:
        </Text>
        <Link href={confirmLink}>Подтвердить почту</Link>
        <Text>
          Эта ссылка действительна в течении 1 часа. Если вы не запрашивали подтверждение, просто проигнорируйте это сообщение.
        </Text>
        <Text>Спасибо за использование нашего сервиса!</Text>
      </Body>
    </Html>
  )
}
