<script>
	import { LoginStatusService } from '$lib/login-status/login-status.service';
	import { Strage } from '$lib/storage/strage';
	import { onMount } from 'svelte';

	let isLoggedIn$;
	let loginStatusService;

	onMount(() => {
		loginStatusService = new LoginStatusService();
		isLoggedIn$ = loginStatusService.isLoggedIn$.asObservable();

		loginStatusService.syncStatus();
	})

	function logout() {
		new Strage().clearNsec();
		loginStatusService.syncStatus();
	}

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>
		Home
	</h1>

	<h2>
		TODO: show nostr time line here.
	</h2>

	{#if $isLoggedIn$}
		<p>LOGGED IN!!!!</p>
	{/if}
	<button class="submit-button" on:click={logout} disabled={!$isLoggedIn$}>Logout</button>


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
