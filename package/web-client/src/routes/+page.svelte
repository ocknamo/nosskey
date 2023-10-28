<script>
	import { onMount } from 'svelte';

	onMount(() => {
		window.location.assign('/home')
	})

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>
		Home
	</h1>

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
