<h1 align="center" style="margin-top: 0px;">AstroTribe</h1>
<!-- <p align="center" style="margin-bottom: 0px !important;">
  <img width="200" src="https://github.com/Drew-Macgibbon/design-portfolio/blob/main/public/readme/doom-logo.png" align="center">
</p> -->
<p align="center" >The AstroTribe App is a social network for astronomers and wannabe astronomers around the globe.</p>

<p align="center">
  <a href="https://astronera.org/">Production</a> --- |  .  | --- <a href="https://astrotribe.vercel.app/">Development</a>
</p>

We're currently working towards an open beta release. If you'd like to be notified when we launch,
register your interest [here](https://astrotribe.vercel.app/auth/register)

### Contributing:

Clone the `develop` Branch Create your Feature Branch `git checkout -b feature/AmazingFeature` Open
a Pull Request against `develop` when the feature is ready for review

#### Helpful links:

[] - [Component Library](https://ui.nuxtlabs.com/) [] - [Icons](https://icones.js.org/)


### Development Setup:

#### Supabase:

install supabase locally if you don't have it already

```bash
brew install supabase/tap/supabase
```

```bash
// make sure docker is open
// download the images
supabase start
//
supabase login
// link the local project to production
supabase link --project-ref <project-id>
// pull down the database
supabase db pull
```


