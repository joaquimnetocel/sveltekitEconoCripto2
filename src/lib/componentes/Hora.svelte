<script lang="ts">
	import { tick } from 'svelte';

	let {
		inicio = new Date(),
		agora = $bindable(),
	}: {
		inicio?: Date;
		agora?: Date;
	} = $props();

	agora = new Date(inicio);

	async function funcaoIniciar() {
		if (agora === undefined) return;
		while (true) {
			agora = new Date(agora.getTime() + 1000); // Adiciona 1 segundo
			await tick();
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	funcaoIniciar();
</script>

<span>{agora?.toLocaleTimeString('pt-BR', { hour12: false })}</span>
