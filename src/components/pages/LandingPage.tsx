import { Route } from 'react-router';
import { Welcome } from './Welcome';

export const LandingPage = () => {
  return (
    <div className="app-container">
      <div className="page-container">
        <div className="page-header">
          <div className="first-part-header">
            <div className="logo-container">
              <p>Metagame</p>
            </div>
            <div className="menu-container">
              {/* <Menu mode="horizontal" onClick={handleMenu} selectedKeys={[selectedMenu]}>
                <Menu.Item key="home">
                  <Link to="/">
                    <Icon type="home" />
                    <span>Início</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="about">
                  <Link to="/sobre">
                    <Icon type="exclamation-circle" />
                    <span>Sobre</span>
                  </Link>
                </Menu.Item>
              </Menu> */}
            </div>
          </div>

          <div className="header-actions">
            {/* <Popover
              content={<PopoverLogin form={loginForm} onLogin={onLogin} />}
              placement="bottom"
              trigger="click"
              visible={loginPopOver}
              onVisibleChange={handlePopoverChange}
            >
              <Button type="link">Entrar</Button>
            </Popover>
            <Link to="/signup">
              <Button type="primary">Cadastrar-se</Button>
            </Link> */}
          </div>
        </div>
        <Route path="/" element={<Welcome />} />
      </div>
    </div>
  );
};
