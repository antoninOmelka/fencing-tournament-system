import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app/data/participants.json");

if (!fs.existsSync(filePath)) {
  console.log("file dont exist!");
  fs.writeFileSync(filePath, JSON.stringify({ participants: [] }, null, 2));
}

export async function GET() {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return new Response(JSON.stringify(data), {
    status: 200,
  });
}

export async function POST(request) {
  const data = await request.json();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return new Response(JSON.stringify({ message: "Participant added", data }), { status: 200 });
}
