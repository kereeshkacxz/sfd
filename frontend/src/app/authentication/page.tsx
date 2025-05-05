'use client';
import {Button, Flex, Text, TextInput, useToaster} from '@gravity-ui/uikit';
import {useState} from 'react';

import styles from './authentication.module.scss';
import {reloadAuth} from '@/system';
import {apiRequest} from '@/utils';

export default function Authentication() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginInvalid, setIsLoginInvalid] = useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const {add} = useToaster();

    const authorize = async () => {
        let flag = false;
        if (login.length < 5) {
            setIsLoginInvalid(true);
            setLoginErrorMessage('Длина логина больше 5 символов');
            flag = true;
        }

        if (password.length < 5) {
            setIsPasswordInvalid(true);
            setPasswordErrorMessage('Длина пароля больше 5 символов');
            flag = true;
        }
        if (flag) return;

        try {
            const data = await apiRequest(
                'auth/login',
                'post',
                {
                    grant_type: 'password',
                    username: login,
                    password: password,
                },
                undefined,
                true,
            );
            // Если вход успешный, продолжаем:
            add({
                title: `Вы успешно авторизованы!`,
                name: 'successful_authorization',
                theme: 'success',
                autoHiding: 2000,
            });
            localStorage.setItem('token', data.access_token);
            const dataAdmin = await apiRequest(
                'auth/me',
                'get',
                {},
                localStorage.getItem('token') ?? undefined,
            );
            localStorage.setItem('role', dataAdmin.role);

            reloadAuth();
        } catch (error) {
            add({
                title: 'Неправильный логин или пароль!',
                name: 'danger_authorization',
                theme: 'danger',
                autoHiding: 2000,
            });
            return;
        }
    };

    return (
        <Flex direction={'column'} gap={6} width={'350px'}>
            <Text variant="subheader-2"> Авторизация </Text>
            <Flex direction={'column'} gap={4}>
                <TextInput
                    placeholder="Введите логин"
                    value={login}
                    onChange={(e) => {
                        setLogin(e.target.value);
                        setIsLoginInvalid(false);
                    }}
                    errorPlacement="inside"
                    validationState={isLoginInvalid ? 'invalid' : undefined}
                    errorMessage={loginErrorMessage}
                />
                <TextInput
                    placeholder="Введите пароль"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setIsPasswordInvalid(false);
                    }}
                    errorPlacement="inside"
                    validationState={isPasswordInvalid ? 'invalid' : undefined}
                    errorMessage={passwordErrorMessage}
                />
            </Flex>
            <div className={styles.buttonWrapper}>
                <Button view="action" onClick={authorize}>
                    Вход
                </Button>
            </div>
        </Flex>
    );
}
