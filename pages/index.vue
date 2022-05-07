<script setup lang="ts">
    import axios from 'axios'
    import CryptoES from 'crypto-es'

    function logout() {
        localStorage.removeItem("auth")
        useRouter().replace('/login')
    }

    onBeforeMount(async () => {
        if (localStorage.getItem("auth") == null) {
            useRouter().replace('/login')
        }

        else {
            const decrypted_token = CryptoES.AES.decrypt(localStorage.getItem("auth"), "10400705")

            const { data } = await axios.get("http://localhost:8000/", {
                headers: {
                    Authorization: "Bearer " + decrypted_token.toString(CryptoES.enc.Utf8)
                }
            })

            data["auth"] || logout()
        }
    })
</script>

<template>
    <div>
        <Head>
            <Title>Main page</Title>
            <Meta name="description" content="This is a simple social network" />
        </Head>

        <h1>Hello from index</h1>
        <button @click="logout">logout</button>
    </div>
</template>