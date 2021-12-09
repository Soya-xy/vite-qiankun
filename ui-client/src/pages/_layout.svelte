<script>
  import { config } from '~/store/app'
  import { connect, StringCodec } from 'nats.ws'
  const servers = { servers: 'ws://localhost:8080' }
  const sc = StringCodec()
  let nc,
    list = []
  if (nc === undefined) {
    connect(servers)
      .then(ws => {
        nc = ws
        ws.subscribe('>', {
          callback: (err, msg) => {
            list = [...list, { subject: msg.subject, msg: sc.decode(msg.data) }]
          },
        })
        setInterval(() => {
          ws.publish('hello', sc.encode('world'))
        }, 2000)
      })
      .catch(err => {
        console.error(err)
      })
  }
  const send = () => {
    nc.publish('hello', sc.encode('hello'))
  }


</script>

<button on:click={send}>say:hello</button>
{#each list as v}
  <p>{v.subject}:{v.msg}</p>
{/each}
{#if $config}
  <slot />
{/if}
