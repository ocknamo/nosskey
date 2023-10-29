<script>
	import { goto } from "$app/navigation";
	import { Login } from "$lib/web-authn/login";

	let login;

	async function execLogin() {
		console.log('Login start!')

		login = new Login();
		await login.loginStart();

		console.log('Login success!')

		goto('/home');
	}
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		Login
	</h1>

	<button class="submit-button" on:click={execLogin}>Login</button>

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
