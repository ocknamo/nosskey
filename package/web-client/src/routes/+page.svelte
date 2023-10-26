<script>
	import { LoginStatusService } from '$lib/login-status/login-status.service';
	import { onMount } from 'svelte';

	let loginStatusService;
	let isLoggedIn = false;

	onMount(() => {
		loginStatusService = new LoginStatusService();
		isLoggedIn = loginStatusService.isLoggedIn;
	})

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>
		Home
	</h1>

	<h2>
		TODO: show here nostr time line
	</h2>

	{#if isLoggedIn}
		<p>LOGGED IN!!!!</p>
	{/if}

	

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
