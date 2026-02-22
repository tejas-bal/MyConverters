export async function GET() {
  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/USD`
  );
  const data = await res.json();
  return Response.json(data);
}