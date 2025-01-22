const {createClient} =supabase
// console.log(supabase)
const supabaseUrl="https://wjtoscuovdylskuflwpo.supabase.co"
const supabaseKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdG9zY3VvdmR5bHNrdWZsd3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1MjMyODQsImV4cCI6MjA1MzA5OTI4NH0.W9pTlvZRD3qfqZBAbgY8p7KTZw-zvf_V9ooIRL2T1Rc"

const supabaseClient = createClient(supabaseUrl, supabaseKey)

window.supabase = supabaseClient


