import { useContext } from 'react';
import { AuthContext } from '../../../store/Auth/AuthState';

// interface Props {
//     toggleTheme(): void;
// }

// const Header: React.FC<Props> = ({ toggleTheme }) => {
const LoginForm = (): any => {
  const { login } = useContext(AuthContext);

  // const [form] = Form.useForm();

  const onLogin = (values: any) => {
    login(values);
  };

  return (
    <div>
      <Form onFinish={onLogin}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
