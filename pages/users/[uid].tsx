import { useRouter } from "next/router";
import { User } from "../../models/User";
import { useEffect, useState } from "react";

type Query = {
  uid:string
}

export default function UserShow() {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();
  const query = router.query as Query

  return <div>{router.query.uid}</div>;
}

