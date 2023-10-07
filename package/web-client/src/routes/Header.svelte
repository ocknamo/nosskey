<script>
	import github from '$lib/images/github.svg';
</script>

<header>
	<nav>
		<a href="/">Home</a>
		<a href="/register">Register</a>
		<a href="/login">Login</a>
	</nav>

	<div class="corner">
		<a href="https://github.com/ocknamo/nosskey">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
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
