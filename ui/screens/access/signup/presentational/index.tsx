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
import {SignUpFormSchemaType} from "../schema";

type SignupPresentationalProps = {
    control: Control<SignUpFormSchemaType>,
    handleSubmit: (() => void);
}

const SignupPresentational: React.FC<SignupPresentationalProps> = ({
                                                                       control,
                                                                       handleSubmit
                                                                   }) => {

    return (
        <Screen direction={'column'} space={"md"}>
            <VStack space='xl' style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                <Text h1>Criar uma nova conta?</Text>
                <Link href={'/'}>
                    <Text information>Já está cadastrado? Faça login aqui</Text>
                </Link>
            </VStack>
            <VStack space='xl' style={{
                flex: 3,
                alignItems: 'center',
                justifyContent: 'flex-start',
                // borderStyle: 'solid',
                // borderWidth: 1,
                // borderColor: 'red'
            }}>
                <Input variant={'underlined'}>
                    <InputField
                        placeholder={'Nome'}
                        name={FormKeys.firstName}
                        control={control}
                    />
                </Input>
                <Input variant={'underlined'}>
                    <InputField
                        placeholder={'Sobrenome'}
                        name={FormKeys.surname}
                        control={control}
                    />
                </Input>
                <Input variant={'underlined'}>
                    <InputField
                        placeholder={'E-mail'}
                        name={FormKeys.email}
                        control={control}
                    />
                </Input>
                <Input variant={'underlined'}>
                    <InputField
                        placeholder={'Data de nascimento'}
                        name={FormKeys.birthday}
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
                <Input variant={'underlined'}>
                    <InputField
                        placeholder={'Confirme sua senha'}
                        name={FormKeys.confirmPassword}
                        control={control}
                    />
                </Input>
                <Input variant={'underlined'}>
                    <InputField
                        placeholder={'Nome da despensa'}
                        name={FormKeys.pantryName}
                        control={control}
                    />
                </Input>
                <Button onPress={handleSubmit} size={'xl-full-width'}>
                    <ButtonText>
                        Cadastrar
                    </ButtonText>
                </Button>
            </VStack>
        </Screen>

    )
}

export default SignupPresentational