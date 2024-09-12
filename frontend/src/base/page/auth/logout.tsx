import { page } from "../../../utils/react/page";
import { Loading } from "../../../utils/ui/loading";

export default page({
  url: "/logout",
  component: ({}) => {
    localStorage.clear();
    _api.logout().then(() => {
      location.href = "/login";
    });

    return <Loading />;
  },
});
