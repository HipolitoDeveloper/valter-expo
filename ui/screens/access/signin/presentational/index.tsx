import {Link} from "expo-router";
import React from "react";
import {Control} from "react-hook-form";
import {Box} from "../../../../components/box";
import {Button, ButtonText} from "../../../../components/button";
import {Input, InputField} from "../../../../components/form/input";
import Screen from "../../../../components/Screen";
import {Text} from "../../../../components/text";
import {VStack} from "../../../../components/vstack";
import {FormKeys} from "../enum";
import {SignInFormSchemaType} from "../schema";

type SigninPresentationalProps = {
    control: Control<SignInFormSchemaType>,
    handleSubmit: (() => void);
}

const SigninPresentational: React.FC<SigninPresentationalProps> = ({
                                                                       control,
                                                                       handleSubmit
                                                                   }) => {

    return (
        <Screen direction={'column'} space={"md"}>
            <Box style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                <Text>Valter</Text>
            </Box>
            <VStack space='md' style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                // borderStyle: 'solid',
                // borderWidth: 1,
                // borderColor: 'red'
            }}>
                <Input variant={'underlined'}>
                    <InputField
                        placeholder={'E-mail'}
                        name={FormKeys.email}
                        control={control}
                    />
                </Input>
                <Input variant={'underlined'}>
                    <InputField
                        placeholder={'Senha'}
                        name={FormKeys.password}
                        control={control}
                    />
                </Input>
                <Text information>Esqueceu sua senha? clique aqui</Text>
                <Button onPress={handleSubmit} size={'xl-full-width'}>
                    <ButtonText>
                        Entrar
                    </ButtonText>
                </Button>
            </VStack>

            <VStack>
                <Link href={'/signup'}>
                    <Text>Não tem cadastro? Inscreva-se aqui</Text>
                </Link>

            </VStack>
        </Screen>

    )
}

export default SigninPresentational