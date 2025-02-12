import GroupTable from "../components/ParticipantTable/ParticipantTable";


const tableData = [
    {
        "id": 5,
        "name": "ROSSI Isabella",
        "year": "2022",
        "club": "HUMANITA",
        "ranking": 3,
        "isPresent": false
    },
    {
        "id": 1,
        "name": "BIANCHI Alessandra",
        "year": "2023",
        "club": "Milano Scherma",
        "ranking": 12,
        "isPresent": false
    },
    {
        "id": 26,
        "name": "VAN DER BERG Yara",
        "year": "2022",
        "club": "Amsterdam Fencing School",
        "ranking": 13,
        "isPresent": false
    },
    {
        "id": 11,
        "name": "LEFEBVRE Hugo",
        "year": "2022",
        "club": "Lyon Fencing Institute",
        "ranking": 22,
        "isPresent": false
    },
    {
        "id": 3,
        "name": "CHEN Sophia",
        "year": "2024",
        "club": "Beijing Blades",
        "ranking": 23,
        "isPresent": false
    },
    {
        "id": 24,
        "name": "SANTOS Maria",
        "year": "2024",
        "club": "USK",
        "ranking": 37,
        "isPresent": false
    },
    {
        "id": 4,
        "name": "O'CONNOR Liam",
        "year": "2023",
        "club": "Dublin Duelists",
        "ranking": 41,
        "isPresent": false
    },
    {
        "id": 40,
        "name": "GUPTA Ravi",
        "year": "2023",
        "club": "Delhi Fencing Club",
        "ranking": 999,
        "isPresent": false
    }
]

function GroupsOverview() {
    return (
        <GroupTable participants={tableData}></GroupTable>
    );
}

export default GroupsOverview;

