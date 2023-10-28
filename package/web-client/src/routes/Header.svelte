<script>
	import github from '$lib/images/github.svg';
	import { LoginStatusService } from '$lib/login-status/login-status.service';
	import { Strage } from '$lib/storage/strage';
	import { onMount } from 'svelte';

	let strage = new Strage();
	let loginStauts = new LoginStatusService();

	onMount(() => {
		strage = new Strage();
		loginStauts = new LoginStatusService();

	});

	function logout() {
		strage.clearAll();
		loginStauts.syncStatus();
	}
</script>

<header>
	<nav>
		<a href="/home">Home</a>
		<a href="/register">Register</a>
		<a href="/login">Login</a>
	</nav>

	<div class="corner">
		<a href="https://github.com/ocknamo/nosskey" target="_blank" rel="noopener noreferrer">
			<img src={github} alt="GitHub"/>
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;

		padding: 16px;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}
</style>
