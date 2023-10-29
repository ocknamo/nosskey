import { Strage } from '$lib/storage/strage';
import {
	SimplePool,
	finishEvent,
	type EventTemplate,
	nip19,
	getPublicKey,
	type VerifiedEvent
} from 'nostr-tools';

export class NostrService {
	pool: SimplePool;
	relays: string[];
	npub = '';

	constructor() {
		// Setup relay
		this.pool = new SimplePool();

		// TODO: Add relay from NIP-07
		this.relays = [
			'wss://relay.damus.io',
			'wss://relay-jp.nostr.wirednet.jp',
			'wss://nos.lol',
			'wss://yabu.me',
			'wss://relay.snort.social'
		];
	}

	async postKind1(text: string): Promise<VerifiedEvent> {
		console.log('[NostrService]: postKind1 start');
		const kind = 1;

		const nsec = new Strage().getNsec(); // FIXME

		if (!nsec) {
			throw new Error('Not logged in!');
		}

		const sk = nip19.decode(nsec).data.toString();
		this.npub = getPublicKey(sk);

		/**
		 * Prepare event.
		 */
		const unsignedEvent: EventTemplate<1> = {
			kind,
			created_at: Math.floor(Date.now() / 1000),
			content: text,
			tags: []
		};

		const event = finishEvent<1>(unsignedEvent, sk);

		// finish
		Promise.all(this.pool.publish(this.relays, event)).finally(() => {
			setTimeout(this.pool.close, 1000);
		});

		return event;
	}
}
