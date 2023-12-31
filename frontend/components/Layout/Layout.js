import { useEffect, useState } from "react";
import nprogress from "nprogress";
import { useRouter } from "next/router";
import { Container, Grid } from "semantic-ui-react";
import SideMenu from "./SideMenu";
import Search from "./Search";
import Navbar from "./Navbar";
import MobileHeader from "./MobileHeader";
import SecondaryNavbar from "./SecondaryNavbar";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function Layout({ children, user }) {
  const router = useRouter();
  const navigation = router.pathname.split("/")[1];

  const queryClient = new QueryClient();

  const messagesRoute = router.pathname === "/messages";

  
  useEffect(() => {
    /** @type {Array<import("next/router").RouterEvent>} */
    const events = ["routeChangeStart", "routeChangeComplete", "routeChangeError"];
  

    events.forEach((event, i) =>
      router.events.on(event, i === 0 ? nprogress.start : nprogress.done)
    );

    
    return () => {
      events.forEach((event, i) =>
        router.events.off(event, i === 0 ? nprogress.start : nprogress.done)
      );
    };
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      {user ? (
        <>
            <SecondaryNavbar />
          <div className="layout">
            <Grid>
              {!messagesRoute ? (
                <>
                  <Grid.Row only="mobile">
                    <MobileHeader user={user} />
                  </Grid.Row>

                  <Grid.Column
                    only="tablet computer"
                    className="menuCol"
                    floated="left"
                    tablet={1}
                    computer={2}
                  >
                    <SideMenu user={user} />
                  </Grid.Column>

                  <Grid.Column mobile={16} tablet={15} computer={12}>
                    {children}
                  </Grid.Column>

                  <Grid.Column
                    className="menuCol searchCol"
                    computer={2}
                    only="computer"
                  >
                    <div className="stickyCol">
                      <Search />
                    </div>
                  </Grid.Column>
                </>
              ) : (
                <>
                  <Grid.Column floated="left" width={1}  />
                  <Grid.Column width={15}>{children}</Grid.Column>
                </>
              )}
            </Grid>
          </div>
        </>
      ) : (
        
        <>
          {navigation === "demo" &&
          <>
            <Navbar demo={true}/>
            {children}
          </>  
        }
        {navigation !== "demo" &&
          <>
            <Navbar demo={false} />
            <Container text style={{ paddingTop: "1rem" }}>
              {children}
            </Container>
          </>  
        }
        </>
      )}
    </QueryClientProvider>
  );
}

export default Layout;
