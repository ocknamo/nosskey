<script>
	import { getRandomBase64Url } from "shared";
	import { Register } from "$lib/web-authn/register";

	let email = '';
	let password = '';

	async function cratePassword() {
		for (let index = 0; index < 3; index++) {
			await new Promise((resolve) => {
				setTimeout(resolve, 100)
			})
			password = getRandomBase64Url(12);
		}
	}

	function submit() {
		// TODO: note password dialog open here!
		const reg =  new Register(email, password);
		reg.registerStart();
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

	<form>
		<label for="email">email</label>
			<input on:focusin={cratePassword} bind:value={email} type="email" name="user_email" id="email">
		<label for="pass">auto generated password</label>
			<input class="password-input" bind:value={password} type="text" name="password" id="pass" disabled>
		<span><button class="change-password-button" on:click={cratePassword} type="button">change password</button></span>
		<button class="submit-button" on:click={submit} type="submit">Register start!</button>
	</form>

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
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
		border: none;
		background: none;
		font-size: 1em;
		margin-top: 8px;
	}

	.submit-button {
		margin-top: 1em;
		height: 3em;
		font-size: 1.4em;
		background-color: paleturquoise;
		border-radius: 10px;
		max-width: 360px;
	}

	button:disabled {
		border: none;
	}
</style>
