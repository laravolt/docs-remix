---
title: File uploads
---

# File uploads

PrelineForm has two file fields, both built on [FilePond](https://pqina.nl/filepond/). `uploader()` stores files in the media library as soon as they are picked and posts their URLs with the form. `filepond()` is a plain FilePond field: the files are posted with the form, or sent to an endpoint you write. {% .lead %}

| | `uploader()` | `filepond()` |
|---|---|---|
| Where files go | Laravolt's media endpoint (`media::store`), or your own with `mediaUrl()` | With the form (multipart), or your endpoint with `server()` |
| What the form posts | `_<name>`: a JSON list of file URLs | The files themselves, or FilePond's server ids |
| Read on the server | `request()->media('<name>')` | `$request->file('<name>')` |
| Files already attached | Shown again after a failed validation, or from a model | — |

Both need `laravolt/laravolt` 8.3 or later; `filepond()` without `server()` needs 8.3.2.

## Setup

Put `@laravoltScripts` in the layout. It adds a small loader that fetches FilePond, its plugins and its styles only on pages that have a file field. FilePond 4.32.12 ships in Laravolt's assets; no npm install is needed.

If `public/laravolt` is a real directory rather than the symlink `php artisan laravolt:link` creates, refresh it after upgrading:

```bash
rm -rf public/laravolt
php artisan laravolt:extract-assets
php artisan laravolt:link
```

A layout without `@laravoltScripts` must load FilePond itself. A copy of FilePond the layout already loaded is used as is.

## uploader()

```blade
{!! PrelineForm::open('posts.store')->post() !!}
    {!! PrelineForm::text('title')->label('Title') !!}
    {!! PrelineForm::uploader('attachments')
        ->label('Attachments')
        ->limit(5)
        ->extensions(['pdf', 'jpg', 'png'])
        ->fileMaxSize(10) !!}
    {!! PrelineForm::submit('Save') !!}
{!! PrelineForm::close() !!}
```

Each file is uploaded while the user fills in the form, with progress, undo and retry. When the form is submitted, the hidden field `_attachments` holds the URLs of the uploaded files:

```php
public function store(Request $request)
{
    $urls = $request->media('attachments')->toArray(); // ['https://…/report.pdf', …]
    $cover = $request->media('cover')->first();        // one URL, or null

    // …
}
```

| Method | Default | Meaning |
|---|---|---|
| `limit(int)` | `1` | Maximum number of files. `1` gives a single-file field. |
| `extensions(array)` | any | Allowed extensions without the dot, checked before upload: `['pdf', 'png']`. |
| `fileMaxSize(int)` | `1024` | Maximum size of each file, in MB, checked before upload. |
| `mediaUrl(string)` | `media::store` | Upload endpoint. The default stores the file with the `fileuploader` handler. |
| `ajax(false)` | on | Post the files with the form instead of uploading them first (see below). |

Labels follow the page language (`<html lang>`).

{% callout title="Validate on the server too" %}
`extensions()` and `fileMaxSize()` only stop the browser from sending a file. Validate uploads in your endpoint or `FormRequest` as you would any other input.
{% /callout %}

### Files already attached

The field shows existing files from a media model, a list of media models, URLs, or the JSON list it posted:

```blade
{!! PrelineForm::uploader('attachments')->limit(5)->value($post->getMedia('attachments')) !!}
```

After a failed validation, the files the user had attached are shown again, and errors on `attachments` or `_attachments` appear under the field.

### Posting the files with the form

With `ajax(false)`, nothing is uploaded before submit. The files are posted as `attachments[]`, so the form must be multipart:

```blade
{!! PrelineForm::open('posts.store')->post()->multipart() !!}
    {!! PrelineForm::uploader('attachments')->limit(3)->ajax(false) !!}
```

`$request->media('attachments')->store('attachments')` adds each posted file to that media collection of the signed-in user and returns the media models. Read the files with `$request->file('attachments')` to attach them to another model.

### Fields added later

Fields that appear after the page loads, in a modal or a fetched fragment, are picked up automatically. To set them up yourself, call `window.LaravoltUploader.init(element)`. `window.LaravoltUploader.ready()` returns a promise that resolves once FilePond is loaded.

## filepond()

```blade
{!! PrelineForm::open('profile.update')->put()->multipart() !!}
    {!! PrelineForm::filepond('photo')->label('Profile photo')->accept(['image/*'])->maxFileSize('5MB') !!}
    {!! PrelineForm::filepond('documents')->multiple()->maxFiles(3)->accept(['application/pdf']) !!}
```

Without `server()`, the files are posted with the form like a normal file input (`photo`, `documents[]`), so the form must be multipart. Read them with `$request->file('photo')`.

| Method | Meaning |
|---|---|
| `multiple()` | Allow several files; the input name gets `[]`. |
| `maxFiles(int)` | Maximum number of files, with `multiple()`. |
| `accept(array)` | MIME types or extensions: `['image/*', 'application/pdf']`. |
| `maxFileSize(string)` | Maximum size per file: `'5MB'`, `'500KB'`. |
| `server(string)` | Upload to this URL instead of posting the files with the form. |
| `instantUpload()` | With `server()`, upload as soon as a file is picked. |
| `withoutImagePreview()` | Turn off image previews. |

### Uploading to your own endpoint

```blade
{!! PrelineForm::filepond('scans')->multiple()->server(route('scans.upload'))->instantUpload() !!}
```

FilePond posts each file to that URL as multipart, in a field with the input's name, and expects the response body to be a text id. The form then posts those ids in `scans[]`. See FilePond's [server configuration](https://pqina.nl/filepond/docs/api/server/) for the full protocol.

When the URL is on the same site (relative, or the same scheme, host and port as the page), FilePond sends the session's CSRF token as `X-CSRF-TOKEN`, so a route in the `web` group accepts the upload. A URL on another origin never receives the token.

## Direct uploads to S3 or R2

For large files sent straight from the browser to object storage, see the client-side uploader in the media package (`media/client-upload/*`). Every multipart step uses the `upload_token` returned when the upload starts. If your app published `public/js/components/client-side-uploader.js`, publish it again after upgrading to 8.3.3:

```bash
php artisan vendor:publish --tag=laravolt-media-assets --force
```
