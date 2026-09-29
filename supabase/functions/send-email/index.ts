const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { to, subject, body } = await req.json();

    if (!Array.isArray(to) || to.length === 0) {
      return new Response(
        JSON.stringify({ error: "Recipients list is required and must be a non-empty array." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!subject || !body) {
      return new Response(
        JSON.stringify({ error: "Subject and body are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY is not configured. Add it as an edge function secret named RESEND_API_KEY in your Supabase project settings." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") ?? "chris34star <onboarding@resend.dev>";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: to,
        subject: subject,
        text: body,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ error: errData.message || `Resend API error (${response.status})` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    return new Response(
      JSON.stringify({ message: `Email sent to ${to.length} recipient${to.length !== 1 ? "s" : ""}.`, id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
