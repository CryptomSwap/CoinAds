# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img [ref=e6]
      - heading "Page not found" [level=3] [ref=e9]
      - paragraph [ref=e10]: The page you're looking for doesn't exist or has been moved.
    - generic [ref=e11]:
      - generic [ref=e12]:
        - link "Go to Homepage" [ref=e13] [cursor=pointer]:
          - /url: /
          - img [ref=e14] [cursor=pointer]
          - text: Go to Homepage
        - link "Go Back" [ref=e17] [cursor=pointer]:
          - /url: javascript:history.back()
          - img [ref=e18] [cursor=pointer]
          - text: Go Back
      - paragraph [ref=e21]:
        - text: Need help?
        - link "Contact support" [ref=e22] [cursor=pointer]:
          - /url: /contact
  - region "Notifications alt+T"
  - generic [ref=e23]:
    - generic [ref=e24]:
      - generic [ref=e25]: "Path:"
      - text: /non-existent-page
    - generic [ref=e26]:
      - generic [ref=e27]: "Environment:"
      - text: development
  - alert [ref=e28]
```