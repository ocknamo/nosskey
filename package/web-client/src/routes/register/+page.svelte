<script>
	import { getRandomBase64Url } from "shared";
	import { Register } from "$lib/web-authn/register";
	import { goto } from '$app/navigation';
	import { onMount } from "svelte";

	let email = '';
	let userName = '';
	let encryptionKey = '';

	onMount(async() => {
		await cratePassword();
	});

	async function cratePassword() {
		for (let index = 0; index < 3; index++) {
			await new Promise((resolve) => {
				setTimeout(resolve, 100)
			})
			encryptionKey = getRandomBase64Url(12);
		}
	}

	async function submit() {
		alert(`Write down the encryption key so you don't forget it.\n\n ${encryptionKey}`)

		const reg =  new Register();
		try {
			await reg.registerStart(email, userName, encryptionKey);
		} catch (error) {
			alert(error.message)

			return;
		}

		goto('/');
	}
</script>

<svelte:head>
	<title>Register</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		Register
	</h1>

	<form on:submit|preventDefault={submit}>
		<label for="userName">user name</label>
			<input bind:value={userName} type="text" name="user_name" id="userName">
		<label for="email">email</label>
			<input bind:value={email} type="email" name="user_email" id="email">
		<label for="encryptionKey">auto generated password</label>
			<input class="password-input" bind:value={encryptionKey} type="text" name="password" id="encryptionKey" disabled>
		<span><button class="change-password-button" on:click={cratePassword} type="button">UPDATE</button></span>
		<input value="Register start!" class="submit-button" type="submit" disabled={ !userName || !email || !encryptionKey  } />
	</form>

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		flex: 0.6;

		align-items: center;
	}

	h1 {
		width: 100%;
	}

	form {
		display: flex;
		flex-direction: column;
		width: 100%;
		font-family: Arial, Helvetica, sans-serif;
	}

	input {
			margin-bottom: 2em;
			max-width: 360px;
			font-size: 1.2em;
			line-height: 2em;
	}

	.password-input {
		margin-bottom: 0em;
	}

	.change-password-button {
		border: 1px solid #AAA;
		border-radius: 4px;
		line-height: 30px;
		background: none;
		font-size: 1em;
		margin-top: 8px;
	}

	button:disabled {
		border: none;
	}
</style>
