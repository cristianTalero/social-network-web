<script setup lang="ts">

    import axios from 'axios';
import { useForm, useField } from 'vee-validate'
    import * as yup from 'yup'

    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/

    const userSchema = computed(() => {
        return yup.object({
            name: yup.string().trim().strict().required('Name is required!')
                .min(5, 'must contain at least 5 characters'),
            username: yup.string().trim().strict().required('Username is required!')
                .min(5, 'must contain at least 5 characters'),
            password: yup.string().trim().strict().required('Password is required!')
                .matches(passwordRegex, 'must contain 8 characters: at least one number, one lowercase, one uppercase and one special character'),
            rePassword: yup.string().trim().strict().required('RePassword is required!')
                .oneOf([yup.ref('password'), 'Password must match'])
        })
    })

    const { handleSubmit, isSubmitting } = useForm({ validationSchema: userSchema })

    const { value: name, errorMessage: nameError } = useField('name');
    const { value: username, errorMessage: usernameError  } = useField('username');
    const { value: password, errorMessage: passwordError  } = useField('password');  
    const { value: rePassword, errorMessage: rePasswordError  } = useField('rePassword');
    
    const status = ref('')
    
    const onSubmit = handleSubmit(async values => {
        status. value = ''

        const { data } = await axios.post("http://localhost:8000/signup", values)

        if (data["created"]) {
            useRouter().replace('/login')
        }

        else {
            status.value = data["error"]
        }
    })

</script>

<template>
    <main>
        <h1>Signup</h1>

        <form @submit.prevent="onSubmit">
            <input placeholder="Name" type="text" name="name" v-model="name" />
            <span v-for="error in nameError">{{ error }}</span>
            
            <input placeholder="Username" type="text" name="username" v-model="username" />
            <span v-for="error in usernameError">{{ error }}</span>

            <input placeholder="Password" type="password" name="password" v-model="password" />
            <span v-for="error in passwordError">{{ error }}</span>
            
            <input placeholder="Re-Password" type="password" name="rePassword" v-model="rePassword" />
            <span v-for="error in rePasswordError">{{ error }}</span>
            
            <input type="submit" value="Go" :disabled="isSubmitting" />
        </form>

        <span v-show="isSubmitting">Loading</span>
        <span>{{ status }}</span>

        <NuxtLink to="/login">GO to login</NuxtLink>
    </main>
</template>