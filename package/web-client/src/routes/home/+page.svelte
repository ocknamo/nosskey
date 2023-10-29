<script>
	import { LoginStatusService } from '$lib/login-status/login-status.service';
	import { NostrService } from '$lib/nostr-service/nostr.service';
	import { Strage } from '$lib/storage/strage';
	import { filter } from 'rxjs';
	import { onMount } from 'svelte';

	import { createRxForwardReq } from 'rx-nostr';
	import { Text, NostrApp, Contacts, UniqueEventList, Metadata } from 'nosvelte';
	import { nip19 } from 'nostr-tools';
	import { goto } from '$app/navigation';

	let isLoggedIn$;
	let loginStatusService;
	let npub;
	let postText;
	const nostrService = new NostrService();

	let postedEvents = []; // for demo.

	// For nosvelte
  let pubkey = '';
  const relays = nostrService.relays;
  const req = createRxForwardReq();

  const targetEventIdOf = (reaction) => {
    // Extract the last 'e' tag in .tags (NIP-25)
    return reaction.tags.filter(([tag]) => tag === 'e').slice(-1)[0][1];
  };

  const pubkeysIn = (contacts) => {
    return contacts.tags.reduce((acc, [tag, value]) => {
      if (tag === 'p') {
        return [...acc, value];
      } else {
        return acc;
      }
    }, []);
  };

  const sorted = (events) => {
    return [...events].sort((a, b) => b.created_at - a.created_at);
  };


	onMount(() => {
		loginStatusService = new LoginStatusService();
		isLoggedIn$ = loginStatusService.isLoggedIn$.asObservable();

		loginStatusService.syncStatus();

		isLoggedIn$.pipe(filter(v => !!v)).subscribe((_) => {
			npub = new Strage().getNpub();
			pubkey = nip19.decode(npub).data.toString();

			console.log('pubkey', pubkey);
		});
	})

	function logout() {
		new Strage().clearNsec();
		loginStatusService.syncStatus();
		npub = '';
		nostrService.npub = '';

		window.location.reload();
	}

	async function postNote() {
		console.log(window)
		const event =  await nostrService.postKind1(postText);

		postedEvents = [...postedEvents, event];

		// Clear textarea
		postText = '';
	}

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

	<div class="top-info">
		<h1>
			Home
		</h1>
		{#if $isLoggedIn$}
		<p class="text">npub: { npub }</p>
		{/if}
	</div>

	<div class="time-line-wrapper">
		
		<!-- // From nosvelte time line. -->
		<NostrApp {relays}>
			<h2>timeline</h2>
		
			<Contacts queryKey={['timeline', 'contacts', pubkey]} {pubkey} let:contacts>
				<div slot="nodata">
					<p>Contacts not found</p>
				</div>
				
				<!-- For demo -->
				{#each sorted(postedEvents) as postedEvent  (postedEvent.id) }
					<section style="border: 1px black solid; padding: 1em; margin-bottom: 1em;">
						<p>
							{'nostrich'}
							:
							{postedEvent.content}
						</p>
					</section>
				{/each}
		
				<UniqueEventList
					queryKey={['timeline', 'feed', pubkey]}
					filters={[
						{
							authors: [...pubkeysIn(contacts)],
							kinds: [1],
							limit: 8
						}
					]}
					{req}
					let:events
				>
					<div slot="loading">
						<p>Loading...</p>
					</div>
		
					<div slot="error" let:error>
						<p>{error}</p>
					</div>

					<div style="display: flex; flex-direction: column; gap: 1em;">

						{#each sorted(events) as event (event.id)}
							<!-- TODO: Re-use request to avoid rate limitting -->
							<Metadata
								queryKey={['timeline', 'metadata', event.pubkey]}
								pubkey={event.pubkey}
								let:metadata
							>
								<section style="border: 1px black solid; padding: 1em;">
									{#if event.kind === 1}
										<p>
											{JSON.parse(metadata.content).name ?? 'nostrich'}
											:
											{event.content}
										</p>
									{:else if event.kind === 6}
										<p>reposted by {JSON.parse(metadata.content).name ?? 'nostrich'}</p>
										<Text
											queryKey={['timeline', targetEventIdOf(event)]}
											id={targetEventIdOf(event)}
											let:text
										>
											<div slot="nodata">
												<p>Failed to get note ({targetEventIdOf(event)})</p>
											</div>
		
											<Metadata
												queryKey={['timeline', 'metadata', text.pubkey]}
												pubkey={text.pubkey}
												let:metadata={repostedMetadata}
											>
												<div slot="nodata">
													<p>Failed to get profile (text.pubkey)</p>
												</div>
		
												<p>
													{JSON.parse(repostedMetadata.content).name ?? 'nostrich'}
													:
													{text.content}
												</p>
											</Metadata>
										</Text>
									{:else if event.kind === 7}
										<p>
											{event.content === '+' ? '👍' : event.content}
											by
											{JSON.parse(metadata.content).name ?? 'nostrich'}
										</p>
										<Text
											queryKey={['timeline', targetEventIdOf(event)]}
											id={targetEventIdOf(event)}
											let:text
										>
											<div slot="nodata">
												<p>Failed to get note ({targetEventIdOf(event)})</p>
											</div>
		
											<Metadata
												queryKey={['timeline', 'metadata', text.pubkey]}
												pubkey={text.pubkey}
												let:metadata={reactedMetadata}
											>
												<div slot="nodata">
													<p>Failed to get profile (text.pubkey)</p>
												</div>
		
												<p>
													{JSON.parse(reactedMetadata.content).name ?? 'nostrich'}
													:
													{text.content}
												</p>
											</Metadata>
										</Text>
									{/if}
								</section>
							</Metadata>
						{/each}
					</div>
				</UniqueEventList>
			</Contacts>
		</NostrApp>

	</div>

	<div class="post-input-wrapper">
		<form>
			<textarea bind:value={postText} class="post-input" type="textarea" name="post-input" id="post-input" placeholder="What are you doing?" disabled={!$isLoggedIn$}></textarea>

			<button on:click={postNote} class="submit-button post-button" type="submit" disabled={!$isLoggedIn$}>Post</button>

		</form>
	</div>


	<button class="submit-button logout-button" on:click={logout} disabled={!$isLoggedIn$}>Logout</button>



<style>
	h1 {
		width: 100%;
	}

	.text {
		word-break: break-all;
	}

	.time-line-wrapper {
		border: 1px solid #DDD;
		overflow-y: scroll;
		flex-grow: 4;
	}

	.post-input-wrapper {
		min-height: 100px;
		border: 1px solid #DDD;
		margin-top: 1em;
	text-align: right;
	}

	.post-input {
		width: calc(100% - 1rem);
		min-width: calc(100% - 1rem);
		max-width: calc(100% - 1rem);
		min-height: 3rem;
		word-break: break-all;
	}

	.post-button {
		font-size: 1.2em;
		margin: 4px;
		height: 32px;
		border-radius: 16px;
	}

	.logout-button {
		font-size: 1em;
		height: 30px;
	}
</style>
