async function test() {
    try {
        const res = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Say hello' }]
            })
        });
        console.log(await res.text());
    } catch(e) {
        console.error(e);
    }
}
test();
