const {createClient} =supabase
// console.log(supabase)
const supabaseUrl="https://csfigvjdpiwrkojsfsnh.supabase.co"
const supabaseKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZmlndmpkcGl3cmtvanNmc25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NjkyMDksImV4cCI6MjA1MzI0NTIwOX0.csTGlVo_IB1n_6MKj9lG1HmIeBxuyV1oTPVnVsY7UK4"

const supabaseClient = createClient(supabaseUrl, supabaseKey)

window.supabase = supabaseClient


