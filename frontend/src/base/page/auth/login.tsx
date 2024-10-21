import { navigate } from "utils/react/navigate";
import { page } from "../../../utils/react/page";
import { useLocal } from "../../../utils/react/use-local";
import { formStyle } from "../../../utils/ui/form.style";
import { Input } from "../../../utils/ui/form/input";
import { Loading } from "../../../utils/ui/loading";

export default page({
  url: "/login",
  component: ({}) => {
    const form = useLocal(
      {
        username: "",
        password: "",
        submitting: false,
        init: false,
      },
      async () => {
        form.init = true;
        form.render();
        const raw_session = localStorage.getItem("prasi-session");

        try {
          const s = JSON.parse(raw_session || "{}");

          if (s && s.id) {
            const rto = (window as any).redirectTo;
            if (rto) {
              navigate(rto);
              return;
            } else {
              navigate("/ed/");
              return;
            }
          }
        } catch (e) {}

        form.init = true;
        form.render();
      }
    );

    if (!form.init) return <Loading />;

    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            form.submitting = true;
            form.render();
            const s = await _api.auth_login(form.username, form.password);

            if (s.status === "failed") {
              form.submitting = false;
              form.render();
              alert(s.reason);
            } else {
              localStorage.setItem(
                "prasi-session",
                JSON.stringify({ data: { user: s.user } })
              );
              let rto = (window as any).redirectTo;
              if (rto) {
                if (
                  location.href.includes("localhost") &&
                  rto.includes("/editor")
                ) {
                  rto = rto.replace("/editor", "/ed");
                }
                navigate(rto);
              } else {
                if (location.href.includes("localhost")) {
                  navigate("/ed");
                } else {
                  navigate("/ed");
                }
              }
            }
          }}
          className={cx("border-[3px] border-black", formStyle)}
        >
          <div className="title">Login</div>
          <label className="mt-3">
            <span>Username</span>
            <Input form={form} name="username" />
          </label>
          <label>
            <span>Password</span>
            <Input form={form} name="password" type="password" />
          </label>
          <button type="submit" disabled={form.submitting}>
            {form.submitting ? "Loading..." : "Submit"}
          </button>

          <div className="pt-2">
            <a href="/register" className="cursor-pointer underline">
              Register
            </a>
          </div>
        </form>
      </div>
    );
  },
});
