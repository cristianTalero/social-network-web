<script setup lang="ts">

    import axios from 'axios';
    import CryptoES from 'crypto-es'
    import { useForm, useField } from 'vee-validate'
    import * as yup from 'yup'

    const userSchema = computed(() => {
        return yup.object({
            username: yup.string().trim().strict().required('Username is required!')
                .min(5, 'must contain at least 5 characters'),
            password: yup.string().trim().strict().required('Password is required!')
                .min(8, 'must contain al least 8 characters')
        })
    })

    const { handleSubmit, isSubmitting } = useForm({ validationSchema: userSchema })

    const { value: username, errorMessage: usernameError  } = useField('username');
    const { value: password, errorMessage: passwordError  } = useField('password');  
 
    const status = ref('')

    const onSubmit = handleSubmit(async values => {
        status.value = ''

        const { data } = await axios.post("http://localhost:8000/login", values)

        if (typeof data["error"] === 'undefined') {
            const encrypted_token = CryptoES.AES.encrypt(data["token"], "10400705").toString()

            localStorage.setItem("auth", encrypted_token)
            useRouter().replace('/')
        }

        else {
            status.value = data["error"]
        }
    })

    onBeforeMount(() => {
        localStorage.getItem("auth") != null &&
            useRouter().replace('/')
    })

</script>

<template>
    <main>
        <h1>Login</h1>

        <form @submit.prevent="onSubmit">
            <input placeholder="Username" type="text" name="username" v-model="username" />
            <span v-for="error in usernameError">{{ error }}</span>

            <input placeholder="Password" type="password" name="password" v-model="password" />
            <span v-for="error in passwordError">{{ error }}</span>
            
            <input type="submit" value="Go" :disabled="isSubmitting" />
        </form>

        <span v-show="isSubmitting">Loading</span>
        <span>{{ status }}</span>

        <NuxtLink to="/signup">GO to signup</NuxtLink>
    </main>
</template>