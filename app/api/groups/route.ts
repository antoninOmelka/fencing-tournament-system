import fs from "fs";
import path from "path";
import { Group } from "@/app/types/group";

const filePath = path.join(process.cwd(), "app/data/groups.json");

if (!fs.existsSync(filePath)) {
    console.log("file dont exist!");
    fs.writeFileSync(filePath, JSON.stringify({ groups: [] }, null, 2));
}

export async function GET() {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  }
  
  export async function POST(request: { json: () => {message: string, data: {groups: Group[]}} }) {
    const data = await request.json();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
    return new Response(JSON.stringify({ message: "Groups added", data }), { status: 200 });
  }