"use client"
import { Button, useToaster, Flex, Text, TextInput } from "@gravity-ui/uikit";
import { useState } from "react";

import styles from './authentication.module.scss'
import { useRouter } from "next/navigation";
import { reloadAuth } from "@/system";

export default function Authentication() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginInvalid, setIsLoginInvalid] = useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const {add} = useToaster();

    const authorize = () => {
        let flag = false;
        if(login.length < 5){
            setIsLoginInvalid(true);
            setLoginErrorMessage('Длина логина больше 5 символов')
            flag = true;
        }

        if(password.length < 5){
            setIsPasswordInvalid(true);
            setPasswordErrorMessage('Длина пароля больше 5 символов')
            flag = true;
        }
        if (flag) return;

        localStorage.setItem('token', login);
        
        if (login === 'superadmin') {
            localStorage.setItem('superadmin', 'true');
        } else if (login === 'admin') {
            localStorage.setItem('admin', 'true');
        }

        add({
            title: `Вы успешно авторизованы!`,
            name: "successful_authorization",
            theme: "success",
            autoHiding: 2000
        });
        reloadAuth();
    };

    return (
        <Flex direction={"column"} gap={6} width={"350px"}>
            <Text variant="subheader-2"> Авторизация </Text>
            <Flex direction={"column"} gap={4}>
                <TextInput 
                    placeholder="Введите логин" 
                    value={login}
                    onChange={(e) => {setLogin(e.target.value); setIsLoginInvalid(false)}}
                    errorPlacement="inside"
                    validationState={isLoginInvalid ? 'invalid' : undefined}
                    errorMessage={loginErrorMessage}
                />
                <TextInput 
                    placeholder="Введите пароль" 
                    type="password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setIsPasswordInvalid(false)}}
                    errorPlacement="inside"
                    validationState={isPasswordInvalid ? 'invalid' : undefined}
                    errorMessage={passwordErrorMessage}
                />
            </Flex>
            <div className={styles.buttonWrapper}>
                <Button view="action" onClick={authorize}>Вход</Button>
            </div>
        </Flex>
    );
}
