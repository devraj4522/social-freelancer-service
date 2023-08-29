import TrustedBy from '@/components/trustedBy/TrustedBy';
import { useRouter } from 'next/router';
import { Container, Grid, Header, Button, Image, Icon, Segment, Card } from 'semantic-ui-react';

function Demo() {
    const router = useRouter();
    return(
        <>
        <Container className='demo'>
        <Grid columns={2} stackable>
        <Grid.Row>
            {/* Left side */}
            <Grid.Column>
            <div style={{ padding: '2em' }}>
                <p>Curated Marketing Quality</p>
                <Header as="h1">Growing is Good But <span className="highlight"> Evolving </span> is Better</Header>
                <Header as="h3" style={{ marginTop: '1em' }}>
                Reach out to your audience in the best way possible. 
                </Header>
                <div className='tick'>
                    <Icon primary name="check"/>
                    <p style={{ marginLeft: '10px' }}>Freelance Social Account</p>
                </div>
                <div className='tick'>
                    <Icon primary name="check"/>
                    <p style={{ marginLeft: '10px' }}>Freelance Market Place</p>
                </div>
                <div className='tick'>
                    <Icon primary name="check"/>
                    <p style={{ marginLeft: '10px' }}>Work Management Tool</p>
                </div>
                <Button primary className='demo-btn' style={{ marginTop: '1em' }} onClick={() => router.push("/login")}> 
                Get Started
                </Button>
            </div>
            </Grid.Column>

            {/* Right side */}
            <Grid.Column>
            <div style={{ padding: '2em' }}>
                <Image
                src="https://res.cloudinary.com/diutgjcc8/image/upload/v1691221972/social_media/img/Untitled_design_1_eygknh.png"
                alt="Hero Image"
                size="large"
                centered
                />
            </div>
            <Segment className="bottom-box" >
                <div className='img-box'>
                    <Image src="https://res.cloudinary.com/diutgjcc8/image/upload/v1691181844/social_media/img/colin-2x-removebg-preview_hk6o7v.png" className="ui medium centered image  left-img" />
                </div>
                <div>
                    <p className='header-bx'>Full Stack Developer</p>
                    <div className='sub'>

                        <div className='rate'>5
                            <i aria-hidden="true" className='star icon'></i>
                        </div>
                        <div>
                            @colin
                        </div>
                    </div>
                    <button className="ui blue button">Hire Me</button>
                </div>
            </Segment>
            <Segment className="top-right">
                <Image style={{width: "100%", height: "100%"}} src="https://res.cloudinary.com/diutgjcc8/image/upload/v1691225205/social_media/img/Screenshot_from_2023-08-05_14-16-26_g5upxe.png" className="ui medium centered image  left-img" />
            </Segment>
            <Segment className="bottom-right">
                <div className='content-left'>
                    <div className='logo-right'>
                        <Image style={{width: "100%", height: "100%"}} src="https://res.cloudinary.com/diutgjcc8/image/upload/v1691230525/social_media/img/icons8-google-wallet-50_2_wwwlbp.png" />
                    </div>
                    <div className='content'>
                        <p className='header-bx'>Ecommerce Market</p>
                        <h6>Manage team with the workmanagement tool</h6>
                    </div>
                </div>
                <button className='ui blue button'>Add</button>
            </Segment>
            </Grid.Column>
        </Grid.Row>
        </Grid>
        </Container>
        <TrustedBy />
        <Container className='demo-feature'>
        <Card>
            <Card.Content>
            {/* <Icon name="globe" size="big" color="blue" /> */}
            <Image alt="" src="https://assets.entrepreneur.com/content/3x2/2000/20151117183622-small-business-woman-desk-office.jpeg" />
            <Card.Header>Freelance Market Place</Card.Header>
            <Card.Description>
            FreelanceX was founded on the principles of empowerment, innovation, and mutual growth. The platform seeks to redefine the freelance experience by creating an ecosystem that values the unique skills of freelancers while catering to the diverse needs of clients. 
            </Card.Description>
            </Card.Content>
        </Card>

        <Card>
            <Card.Content>
            <Image alt="" src="https://www.fs-poster.com/uploads/posts/e057c52370ad3668ac2c013616bc8270.jpeg?ver=40" />
            <Card.Header>Freelancers Only Social</Card.Header>
            <Card.Description>
            The ever-evolving landscape of the digital age, social media has emerged as a powerful tool that shapes how we communicate, interact, and express ourselves. Among this vast digital realm, a unique and vibrant platform has been born - UniteVerse. Conceived with a vision to foster meaningful connections and empower diverse communities, UniteVerse stands as a testament to the boundless potential of human interaction in the virtual world.
            </Card.Description>
            </Card.Content>
        </Card>

        <Card>
            <Card.Content>
            <Image alt="" src="https://timemator.com/images/screenshots/reports.png" />
            <Card.Header>Work Management Tool Information</Card.Header>
            <Card.Description>
            n the fast-paced world of modern business, staying organized and maximizing productivity are paramount. As the demands of work continue to evolve, a cutting-edge work management tool has emerged 
            </Card.Description>
            </Card.Content>
        </Card>
        </Container>
        </>
    );
};

export default Demo;