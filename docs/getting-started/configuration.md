# Configuration

To enable `fsecurity` place the `@EnableFsecurity` anywhere in your project.

```java
@EnableFsecurity
public class FsecurityConfiguration {}
```
It's a good idea to place it in a separate configuration class. `@EnableFsecurity` is a `@Configuration` itself
you don't have to define `@Configuration` on your configuration class.

## Authentication

Next you should add a bean of `AuthenticationHandler` which will be used to authenticate users.

```java
public class JwtAuthenticationHandler extends AuthenticationHandler {

    @Override
    public Identity authenticate(HttpServletRequest request) {
      //Your authentication logic here
      //You should return an object of type Identity if the user is authenticated
      //Otherwise you should return null or throw AuthenticationException
    }
}
```

You could have exposed this class as a `@Component` but you can as well expose it as a `@Bean` from the configuration 
class.

```java
@EnableFsecurity
public class FsecurityConfiguration {

    @Bean
    public AuthenticationHandler authenticationHandler() {
        return new JwtAuthenticationHandler();
    }

}
```

And that is it, now if you want to secure an endpoint you use the @Authenticated annotation.

```java
public class TestController {

  @Authenticated
  @GetMapping("/test")
  public ResponseEntity<Identity> test(Identity user){
    return new ResponseEntity<>(user, HttpStatus.OK);
  }
  
}
```

Request will be intercepted, and your authentication handler will be used to try to authenticate the request. If it 
succeeds the request will be processed. You can inject the `Identity` to your controller method by just
declaring it as a parameter.


## Authorization

If you want to secure an endpoint with a specific role you can use the different options of the 
`@Authenticated` annotation.

### hasRole
```java
public class TestController {

  @Authenticated(hasRole = "ADMIN")
  @GetMapping("/test")
  public ResponseEntity<Identity> test(Identity user){
    return new ResponseEntity<>(user, HttpStatus.OK);
  }
}
```
It should be self-explanatory, the user should have the role `ADMIN` to access this endpoint.

### hasAnyRole

```java
public class TestController {

  @Authenticated(hasAnyRole = {"ADMIN", "USER"})
  @GetMapping("/test")
  public ResponseEntity<Identity> test(Identity user){
    return new ResponseEntity<>(user, HttpStatus.OK);
  }
}
```
Again, should be self-explanatory, the user should have any of the roles `ADMIN` or `USER` to access this endpoint.

### hasAllRoles

```java
public class TestController {

  @Authenticated(hasAllRoles = {"ADMIN", "USER"})
  @GetMapping("/test")
  public ResponseEntity<Identity> test(Identity user){
    return new ResponseEntity<>(user, HttpStatus.OK);
  }
}
```
And finally, the user should have all the roles `ADMIN` and `USER` to access this endpoint.

::: warning
If you specify more than one option, all options will be checked and their results will be combined
:::

So if you specify `hasRole = "USER"` and `hasAnyRole = {"ADMIN", "MANAGER"}` and the user has the role `USER` 
the decision will be `true && false` which is `false`. So the user will not be able to access the endpoint.

## Exception handling

By default, fsecurity will throw an `AuthenticationException` if the user is not authenticated and an 
`AuthorizationException` if the user is not authorized to access the endpoint.

In the case of `AuthenticationException` the response will be `401 Unauthorized` and in the case of
`AuthorizationException` the response will be `403 Forbidden`.

If you want to handle these exceptions differently you can set both the `authenticationExceptionHandler`
and the `authorizationExceptionHandler` on your `AuthenticationHandler`.

`SecurityExceptionHandler` is an interface with a single method `handleException` which takes a `HttpServletRequest`
, `HttpServletResponse` and an `Exception` as parameters.

```java
@Bean
public AuthenticationHandler authenticationHandler() {
return new JwtAuthenticationHandler()
    .authorizationExceptionHandler((request, response, e) -> {
      System.out.println("Authorization exception handler custom");
      response.sendError(403);
    })
    .authenticationExceptionHandler((request, response, e) -> {
      System.out.println("Authentication exception handler custom");
      response.sendError(401);
    });
}
```
Since the `SecurityExceptionHandler` is a functional interface you can use a lambda expression to set the handlers.

## Multiple AuthenticationHandlers

You can have multiple `AuthenticationHandler` beans in your project. If you have more than one `AuthenticationHandler`
you must explicitly specify which one you want to use for a specific endpoint.

```java
public class TestController {

  @Authenticated(hasAnyRole = {"ADMIN", "USER"}, handler = BasicAuthenticationHandler.class)
  @GetMapping("/test")
  public ResponseEntity<Identity> test(Identity user){
    return new ResponseEntity<>(user, HttpStatus.OK);
  }
}
```

In this example the `BasicAuthenticationHandler` will be used to authenticate the request.
If at the point of processing the request the `BasicAuthenticationHandler` is not the only 
type of `AuthenticationHandler` in the project, an `NoUniqueBeanDefinitionException` will be thrown and
you should see a message like this in the logs:

```Multiple AuthenticationHandler beans found, you must specify which one to use on the @Authenticated annotation```

::: tip
There is no need to define a handler if you only have one `AuthenticationHandler` in your project.
:::
