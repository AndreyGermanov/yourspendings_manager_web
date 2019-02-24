import LoginContainer from './LoginForm'

/**
 * Factory to get instances of Item containers and connected components
 */
export default class Auth {

    // Cache of created instances
    static instances = {};

    static createInstanceOf(componentName) {
        switch (componentName) {
            case "login": return new LoginContainer();
            default: return null;
        }
    }

    /**
     * Returns instance of Detail view container for specified database model
     * @param componentName: Name of model
     */
    static getInstanceOf(componentName) {
        if (!Auth.instances[componentName])
            Auth.instances[componentName] = Auth.createInstanceOf(componentName);
        return Auth.instances[componentName];
    }

    /**
     * Returns instance of wired Container component
     * @param componentName: Name of model
     */
    static getComponentOf(componentName) {
        switch (componentName) {
            case "login": return LoginContainer.getComponent();
            default: return null;
        }
    }
}